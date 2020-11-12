defmodule Domain.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Domain.Repo
  alias Domain.Accounts.{User}

  @doc """
  Gets a user by email.

  ## Examples

    iex> get_user_by_email("foo@example.com")
    %User{}

    iex> get_user_by_email("unknown@example.com")
    nil

  """
  def get_user_by_email(email) when is_binary(email) do
    Repo.get_by(User, email: email)
  end

  @doc false
  def get_user_by_access_token(access_token) when is_binary(access_token) do
    user = Repo.get_by(User, access_token: access_token)

    if is_nil(user) do
      nil
    else
      case BeagleClient.validate_auth_token(access_token) do
        {:ok, _} ->
          user

        {:error, _} ->
          case BeagleClient.refresh_auth_token(user.refresh_token) do
            {:ok, resp} -> update_user(user, %{"access_token" => resp["access"]})
            {:error, _} -> update_user(user, %{"access_token" => nil, "refresh_token" => nil})
          end
      end
    end
  end

  @doc false
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc false
  def delete_user_tokens(%User{} = user) do
    user
    |> User.changeset(%{"refresh_token" => nil, "access_token" => nil})
    |> Repo.update()
  end

  @doc """
  Creates or update a user.
  """

  def create_or_update_user(%{
        "user" => %{"email" => email},
        "access" => access_token,
        "refresh" => refresh_token
      }) do
    Repo.insert!(
      %User{email: email, access_token: access_token, refresh_token: refresh_token},
      on_conflict: [set: [access_token: access_token, refresh_token: refresh_token]],
      conflict_target: :email
    )
  end

  @doc """
  Gets a user by email and password.

  ## Examples

      iex> get_user_by_email_and_password("foo@example.com", "correct_password")
      %User{}

      iex> get_user_by_email_and_password("foo@example.com", "invalid_password")
      nil

  """
  def get_user_by_email_and_password(email, password)
      when is_binary(email) and is_binary(password) do
    [username, _] = String.split(email, "@")

    case BeagleClient.fetch_auth_token(username, password) do
      {:ok, data} ->
        create_or_update_user(data)

      {:error, message} ->
        IO.inspect(message)
        nil
    end
  end

  def get_user_by_email_and_password(_, _), do: nil
end